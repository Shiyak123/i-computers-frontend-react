import { createClient } from "@supabase/supabase-js";

const key =
    "sb_publishable_Dd4Hw7tK2OHZOGkHMJp6zg_GQ5QUI7M"
const url = "https://nykhathmijnvzzqtivsv.supabase.co"

const supabase = createClient(url, key);

export default function uploadMedia(file) {
    return new Promise((resolve, reject) => {
        if (file == null) {
            reject("No file provided");
        } else {
            const timestamp = new Date().getTime();

            const fileName = timestamp + "_" + file.name;

            supabase.storage
                .from("images")
                .upload(fileName, file)
                .then(() => {
                    const publicUrl = supabase.storage
                        .from("images")
                        .getPublicUrl(fileName).data.publicUrl;

                    resolve(publicUrl);
                }).catch((error) => {
                    reject(error);
                });
        }
    });
}