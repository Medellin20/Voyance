import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationPayload {
  action_type: string;
  email: string;
  full_name?: string;
  phone?: string;
  message?: string;
  user_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: NotificationPayload = await req.json();

    const { action_type, email, full_name, phone, message, user_id } = payload;

    const adminEmail = "huseinovica82@gmail.com";

    let emailBody = `
NOUVELLE NOTIFICATION - ${action_type.toUpperCase()}
=====================================

Type d'action: ${action_type}
Date: ${new Date().toLocaleString("fr-FR")}

`;

    if (action_type === "signup") {
      emailBody += `NOUVEL UTILISATEUR INSCRIT

Nom: ${full_name || "Non spécifié"}
Email: ${email}
Téléphone: ${phone || "Non spécifié"}
ID Utilisateur: ${user_id || "Non spécifié"}
`;
    } else if (action_type === "signin") {
      emailBody += `CONNEXION UTILISATEUR

Email: ${email}
Nom: ${full_name || "Non spécifié"}
ID Utilisateur: ${user_id || "Non spécifié"}
`;
    } else if (action_type === "contact") {
      emailBody += `NOUVEAU MESSAGE DE CONTACT

Nom: ${full_name || "Non spécifié"}
Email: ${email}
Téléphone: ${phone || "Non spécifié"}
Message:
${message || "Aucun message"}
`;
    } else if (action_type === "payment") {
      emailBody += `NOUVELLE TRANSACTION

Nom: ${full_name || "Non spécifié"}
Email: ${email}
Détails: ${message || "Non spécifié"}
`;
    }

    emailBody += `
=====================================
Cet email a été généré automatiquement par le système.`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@voyance-etoilee.fr",
        to: adminEmail,
        subject: `[${action_type.toUpperCase()}] Notification utilisateur - ${email}`,
        html: `<pre>${emailBody}</pre>`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});