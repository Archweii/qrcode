import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { qrcode } from "./mod.ts";
import { decode } from "https://deno.land/std@0.192.0/encoding/base64.ts"

serve(async (req: Request) => {

    // Only support the GET method
    if(req.method !== 'GET') {
        return new Response('Method not allowed: Only -GET- mettod allowed', {
            status: 405
        })
    }

    // Extract the data from the URL requested
    const params = new URL(req.url).searchParams
    const content = params.get('content')

    // The request is missing the content
    if(!content) {
        return new Response('Bad Request: Missing the -content- GET parameter', {
            status: 400
        })
    }

    // Generate the image itself
    //  will be returned as a base64 string image, data:image/gif;base64,...
    let base64Image = await qrcode(content)
    
    // Remove the html parts of the image
    base64Image = base64Image.replace('data:image/gif;base64,', '')
    
    // Decode the base64 image to send as real image to the client
    const result = decode(base64Image)
    
    return new Response(result, {
        headers: {
            'Content-Type': 'image/gif'
        }
    })
});
