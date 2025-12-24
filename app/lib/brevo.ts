export async function upsertBrevoContact(
    email: string,
    fullName: string,
    phone: string
) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.error("Faltan variables de entorno de Brevo (API KEY)");
        return;
    }

    // Separar nombre si fuera necesario, pero el requerimiento dice usar fullName en FIRSTNAME
    // Brevo attributes keys: FIRSTNAME, PHONE (según pedido)

    try {
        const res = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                email: email,
                attributes: {
                    FIRSTNAME: fullName,
                    PHONE: phone,
                },
                updateEnabled: true, // Para evitar duplicados y actualizar si existe
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error creando/actualizando contacto en Brevo:", errorData);
        } else {
            console.log(`Contacto Brevo procesado: ${email}`);
        }
    } catch (error) {
        console.error("Error de red llamando a Brevo Contacts:", error);
    }
}
