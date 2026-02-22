import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { supabase } from '$lib/supabase';
import { checkRateLimit } from '$lib/ratelimit';
import { z } from 'zod';

const SUPABASE_BUCKET = 'favicons';
// 30 minutes
const SUPABASE_CACHE_CONTROL = '1800';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const requestSchema = z.object({
	size: z.number().int().min(8).max(128),
	format: z.enum(['ico', 'png', 'jpg'])
});

export const POST = async ({ request, getClientAddress }) => {
	try {
		const clientIp = getClientAddress();
		const isAllowed = await checkRateLimit(clientIp);

		if (!isAllowed) {
			return json(
				{
					success: false,
					error: 'You are trying to upload too many files. Please try later'
				},
				{ status: 429 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('image');

		if (!(file instanceof File) || file.size === 0) {
			return json({ success: false, error: 'No image provided' }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			return json({ success: false, error: 'File too large (max 10MB)' }, { status: 400 });
		}

		const parsed = requestSchema.safeParse({
			size: Number(formData.get('size')),
			format: formData.get('format')
		});

		if (!parsed.success) {
			return json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
		}

		const { size, format } = parsed.data;

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const sharpInstance = sharp(buffer).resize(size, size, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		});

		let processedBuffer: Buffer;
		let contentType: string;
		let fileExtension: string;

		if (format === 'jpg') {
			processedBuffer = await sharpInstance.toFormat('jpeg', { quality: 90 }).toBuffer();
			contentType = 'image/jpeg';
			fileExtension = 'jpg';
		} else if (format === 'png') {
			processedBuffer = await sharpInstance.toFormat('png').toBuffer();
			contentType = 'image/png';
			fileExtension = 'png';
		} else {
			processedBuffer = await sharpInstance.toFormat('png').toBuffer();
			contentType = 'image/x-icon';
			fileExtension = 'ico';
		}

		const fileName = `favicon-${Date.now()}.${fileExtension}`;
		const { error: uploadError } = await supabase.storage
			.from(SUPABASE_BUCKET)
			.upload(fileName, processedBuffer, {
				contentType,
				cacheControl: SUPABASE_CACHE_CONTROL
			});

		if (uploadError) {
			throw uploadError;
		}

		const {
			data: { publicUrl }
		} = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fileName);

		return json({ success: true, faviconUrl: publicUrl });
	} catch (error: unknown) {
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'An unknown error occurred'
			},
			{ status: 500 }
		);
	}
};
