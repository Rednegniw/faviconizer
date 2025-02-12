import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { supabase } from '$lib/supabase';

export const POST = async ({ request }) => {
    try {
        const { imageUrl } = await request.json();
        
        // Download the image from Supabase
        const { data: fileData } = await supabase.storage
            .from('favicons')
            .download(imageUrl.split('/').pop());

        if (!fileData) {
            throw new Error('Could not download image');
        }

        // Process the image with Sharp
        const processedBuffer = await sharp(await fileData.arrayBuffer())
            .resize(64, 64, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat('png')
            .toBuffer();

        // Upload the processed favicon
        const fileName = `favicon-${Date.now()}.ico`;
        const { error } = await supabase.storage
            .from('favicons')
            .upload(fileName, processedBuffer, {
                contentType: 'image/x-icon',
                cacheControl: '1800' // 30 minutes
            });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('favicons')
            .getPublicUrl(fileName);

        return json({ success: true, faviconUrl: publicUrl });
    } catch (error: unknown) {
        console.error('Error processing favicon:', error);
        return json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        }, { status: 500 });
    }
}; 