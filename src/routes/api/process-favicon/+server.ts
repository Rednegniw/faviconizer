import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { supabase } from '$lib/supabase';

export const POST = async ({ request }) => {
    console.log('🚀 Starting favicon processing request');
    try {
        // Get the file from the request
        console.log('📥 Extracting file from form data...');
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            console.error('❌ No image file found in request');
            throw new Error('No image provided');
        }
        console.log('✅ File received:', { 
            type: file.type, 
            size: `${(file.size / 1024).toFixed(2)}KB` 
        });

        // Convert file to buffer
        console.log('🔄 Converting file to buffer...');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('✅ Buffer created, size:', `${(buffer.length / 1024).toFixed(2)}KB`);

        // Process the image with Sharp
        console.log('🎨 Processing image with Sharp...');
        const processedBuffer = await sharp(buffer)
            .resize(64, 64, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFormat('png')
            .toBuffer();
        console.log('✅ Image processed, new size:', `${(processedBuffer.length / 1024).toFixed(2)}KB`);

        // Upload the processed favicon
        const fileName = `favicon-${Date.now()}.ico`;
        console.log('☁️ Uploading to Supabase:', fileName);
        const { error: uploadError } = await supabase.storage
            .from('favicons')
            .upload(fileName, processedBuffer, {
                contentType: 'image/x-icon',
                cacheControl: '1800' // 30 minutes
            });

        if (uploadError) {
            console.error('❌ Supabase upload failed:', uploadError);
            throw uploadError;
        }
        console.log('✅ File uploaded successfully');

        // Get the public URL
        console.log('🔗 Generating public URL...');
        const { data: { publicUrl } } = supabase.storage
            .from('favicons')
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