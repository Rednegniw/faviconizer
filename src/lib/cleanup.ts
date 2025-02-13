import { supabase } from './supabase';

const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const cleanupOldFavicons = async () => {
    try {
        const cleanupIntervalAgo = new Date(Date.now() - CLEANUP_INTERVAL);

        // List all files in the favicons bucket
        const { data: files, error: listError } = await supabase.storage
            .from('favicons')
            .list();

        if (listError) throw listError;

        // Filter files older than the cleanup interval
        const oldFiles = files?.filter(file => {
            const createdAt = new Date(file.created_at);
            return createdAt < cleanupIntervalAgo;
        });

        if (oldFiles?.length > 0) {
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