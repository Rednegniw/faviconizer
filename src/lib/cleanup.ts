import { supabase } from './supabase';

const MAX_FILE_AGE = 10 * 60 * 1000; // 10 minutes
export const CLEANUP_RUN_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const cleanupOldFavicons = async () => {
	try {
		const cutoff = new Date(Date.now() - MAX_FILE_AGE);

		const { data: files, error: listError } = await supabase.storage.from('favicons').list();

		if (listError) throw listError;

		const oldFiles = files?.filter((file) => {
			const createdAt = new Date(file.created_at);
			return createdAt < cutoff;
		});

		if (oldFiles?.length > 0) {
			const { error: deleteError } = await supabase.storage
				.from('favicons')
				.remove(oldFiles.map((file) => file.name));

			if (deleteError) throw deleteError;
		}
	} catch {
		// Cleanup failures are non-critical; the next run will retry
	}
};
