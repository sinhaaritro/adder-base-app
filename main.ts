// Import the standard library's HTTP server module
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// Define the port to listen on, defaulting to 8000
const PORT = 8000;

console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}/`);

// The main handler function for incoming requests
const handler = async (request: Request): Promise<Response> => {
  // Only respond to requests for the root path "/"
  if (new URL(request.url).pathname !== "/") {
    return new Response("Not Found", { status: 404 });
  }

  try {
    // 1. Read the environment variable "WELCOME_MESSAGE"
    //    Provide a default message if the variable is not set.
    const welcomeText = Deno.env.get("WELCOME_MESSAGE") || "This text comes from an environment variable!";

    // 2. Read the static HTML file into a string
    const htmlTemplate = await Deno.readTextFile("./index.html");

    // 3. Replace a placeholder in the HTML with the welcome text
    const finalHtml = htmlTemplate.replace(
      "{{WELCOME_TEXT_PLACEHOLDER}}",
      welcomeText
    );

    // 4. Return the final HTML as the response
    return new Response(finalHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

// Start the server
await serve(handler, { port: PORT });