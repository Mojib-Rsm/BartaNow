
'use server';

import ImageKit from 'imagekit';

const isImageKitConfigured = process.env.IMAGEKIT_PUBLIC_KEY &&
                             process.env.IMAGEKIT_PRIVATE_KEY &&
                             process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit: ImageKit | null = null;

if (isImageKitConfigured) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
} else {
    console.warn("ImageKit is not configured. Image uploads will not work in production.");
}


export async function uploadImage(base64Image: string, fileName: string): Promise<string> {
    if (!imagekit) {
        console.error("ImageKit is not configured, cannot upload image.");
        // In a real scenario, you might want to throw an error
        // For this demo, we'll return a placeholder to avoid breaking the UI.
        return 'https://picsum.photos/seed/placeholder-error/800/600';
    }

    try {
        const response = await imagekit.upload({
            file: base64Image,
            fileName: fileName,
            folder: '/bartanow/', // Optional: you can organize uploads into folders
            useUniqueFileName: true,
        });
        return response.url; // Return the URL of the uploaded image
    } catch (error) {
        console.error("Error uploading to ImageKit:", error);
        throw new Error("Failed to upload image.");
    }
}
