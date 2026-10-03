export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    service: 'tallyridge-assurance',
    surface: 'gtm-demo',
    dataMode: 'synthetic-only'
  });
}
