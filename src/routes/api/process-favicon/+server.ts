import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { supabase } from '$lib/supabase';
import { checkRateLimit } from '$lib/ratelimit';

const SUPABASE_BUCKET = 'favicons';
const SUPABASE_CACHE_CONTROL = '1800';

export const POST = async ({ request, getClientAddress }) => {
    console.log('🚀 Starting favicon processing request');
    try {
        // Check rate limit first
        const clientIp = getClientAddress();
        console.log('🔒 Checking rate limit for IP:', clientIp);
        const isAllowed = await checkRateLimit(clientIp);
        
        if (!isAllowed) {
            console.log('❌ Rate limit exceeded for IP:', clientIp);
            return json({ 
                success: false, 
                error: 'You are trying to upload too many files. Please try later' 
            }, { status: 429 });
        }

        // Get the file from the request
        console.log('📥 Extracting file from form data...');
        const formData = await request.formData();
        const file = formData.get('image') as File;
        const size = Number(formData.get('size')) || 64;
        const format = (formData.get('format') as 'ico' | 'png' | 'jpg') || 'ico';
        
        if (!file) {
            console.error('❌ No image file found in request');
            throw new Error('No image provided');
        }
        
        console.log('✅ File received:', { 
            type: file.type, 
            size: `${(file.size / 1024).toFixed(2)}KB`,
            targetSize: size,
            format
        });

        // Convert file to buffer
        console.log('🔄 Converting file to buffer...');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('✅ Buffer created, size:', `${(buffer.length / 1024).toFixed(2)}KB`);

        // Process the image with Sharp
        console.log('🎨 Processing image with Sharp...');
        const sharpInstance = sharp(buffer)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            });

        // Convert to the requested format
        let processedBuffer: Buffer;
        let contentType: string;
        let fileExtension: string;

        if (format === 'jpg') {
            processedBuffer = await sharpInstance
                .toFormat('jpeg', { quality: 90 })
                .toBuffer();
            contentType = 'image/jpeg';
            fileExtension = 'jpg';
        } else if (format === 'png') {
            processedBuffer = await sharpInstance.toFormat('png').toBuffer();
            contentType = 'image/png';
            fileExtension = 'png';
        } else {
            // Default to ICO
            processedBuffer = await sharpInstance.toFormat('png').toBuffer();
            contentType = 'image/x-icon';
            fileExtension = 'ico';
        }

        console.log('✅ Image processed, new size:', `${(processedBuffer.length / 1024).toFixed(2)}KB`, 'format:', format);

        // Upload the processed favicon
        const fileName = `favicon-${Date.now()}.${fileExtension}`;
        console.log('☁️ Uploading to Supabase:', fileName);
        const { error: uploadError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(fileName, processedBuffer, {
                contentType,
                cacheControl: SUPABASE_CACHE_CONTROL
            });

        if (uploadError) {
            console.error('❌ Supabase upload failed:', uploadError);
            throw uploadError;
        }
        console.log('✅ File uploaded successfully');

        // Get the public URL
        console.log('🔗 Generating public URL...');
        const { data: { publicUrl } } = supabase.storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(fileName);
        console.log('✅ Public URL generated:', publicUrl);

        return json({ success: true, faviconUrl: publicUrl });
    } catch (error: unknown) {
        console.error('❌ Error processing favicon:', error);
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        }, { status: 500 });
    }
}; 