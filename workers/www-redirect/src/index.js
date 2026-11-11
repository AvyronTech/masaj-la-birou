const CANONICAL_HOST = 'benvora-grup.avyron.eu';

export default {
  fetch(request) {
    const destination = new URL(request.url);
    destination.protocol = 'https:';
    destination.host = CANONICAL_HOST;

    return Response.redirect(destination.toString(), 301);
  },
};
