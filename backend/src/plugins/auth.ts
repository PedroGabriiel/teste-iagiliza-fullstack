// Pequeno preHandler reutilizável que exige autenticação JWT
// Usa o decorator `request.jwtVerify` adicionado pelo plugin jwt.ts quando disponível.
// Se o plugin não estiver presente, faz uma verificação manual do header Authorization
import jwt from 'jsonwebtoken';

export async function authPreHandler(request: any, reply: any) {
  // Se o plugin JWT foi registrado corretamente, delega a verificação a ele
  if (request && typeof request.jwtVerify === 'function') {
    await request.jwtVerify();
    return;
  }

  // Fallback: verifica manualmente o header Authorization
  const auth = (request.headers?.authorization as string) || '';
  if (!auth) {
    throw (reply?.server?.httpErrors?.unauthorized) ? reply.server.httpErrors.unauthorized('Missing authorization') : new Error('Missing authorization');
  }

  const parts = auth.split(' ');
  if (parts.length !== 2) {
    throw (reply?.server?.httpErrors?.unauthorized) ? reply.server.httpErrors.unauthorized('Bad authorization header') : new Error('Bad authorization header');
  }

  const token = parts[1];
  try {
    const secret = process.env.JWT_SECRET || 'change-this-in-env';
    const decoded = jwt.verify(token, secret) as any;
    request.user = decoded;
    return;
  } catch (err) {
    throw (reply?.server?.httpErrors?.unauthorized) ? reply.server.httpErrors.unauthorized('Invalid token') : new Error('Invalid token');
  }
}

export default authPreHandler;
