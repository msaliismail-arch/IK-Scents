import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from '@supabase/supabase-js';

// Initialise la connexion à Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null; // J'ai gardé "image" comme dans ton code

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename (on garde ta logique avec uuid)
    const ext = file.name.split(".").pop() || "png";
    const filename = `${uuidv4()}.${ext}`;

    // ENVOIE VERS SUPABASE AU LIEU D'ÉCRIRE EN LOCAL
    const { data, error } = await supabase.storage
      .from('perfume-images') // Le nom du dossier qu'on a créé sur Supabase
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // RÉCUPÈRE L'URL PUBLIQUE DE L'IMAGE SUR SUPABASE
    const { data: publicUrlData } = supabase.storage
      .from('perfume-images')
      .getPublicUrl(filename);

    // Renvoie l'URL publique complète (au lieu de /api/uploads/...)
    return NextResponse.json({
      url: publicUrlData.publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}