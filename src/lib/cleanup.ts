import { supabase } from './supabase';

export const cleanupOldFavicons = async () => {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        // List all files in the favicons bucket
        const { data: files, error: listError } = await supabase.storage
            .from('favicons')
            .list();

        if (listError) throw listError;

        // Filter files older than 30 minutes
        const oldFiles = files?.filter(file => {
            const createdAt = new Date(file.created_at);
            return createdAt < thirtyMinutesAgo;
        });

        if (oldFiles && oldFiles.length > 0) {
            // Delete old files
            const { error: deleteError } = await supabase.storage
                .from('favicons')
                .remove(oldFiles.map(file => file.name));

            if (deleteError) throw deleteError;

            console.log(`Deleted ${oldFiles.length} old favicon(s)`);
        }
    } catch (error) {
        console.error('Error cleaning up old favicons:', error);
    }
}; 