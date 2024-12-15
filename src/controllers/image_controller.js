import { getSupabaseClient } from "/db/supabase.js";

export default class ImageController {
  static async get({ params, response }) {
    const filename = params.filename;

    // see: https://supabase.com/docs/reference/javascript/storage-from-download
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from("images").download(
      filename,
    );

    if (error) {
      console.log(error);
      response.status = 404;
      return;
    }

    response.headers.set("Content-Type", data.type);
    response.body = data.stream();
  }
}
