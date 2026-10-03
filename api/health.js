export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.status(200).json({
    ok: true,
    service: 'tallyridge-assurance',
    version: '2.0.0',
    surface: 'public-gtm',
    dataMode: 'synthetic-only',
    productionDataPlane: false
  });
}
