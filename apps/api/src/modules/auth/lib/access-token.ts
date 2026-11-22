import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type AccessTokenPayload = {
  sub: string;
};

export async function createAccessToken(
  jwtService: JwtService,
  userId: string,
): Promise<string> {
  return jwtService.signAsync({ sub: userId });
}

export async function getUserIdFromAuthorizationHeader(
  jwtService: JwtService,
  authorizationHeader?: string,
): Promise<string> {
  const [scheme, token, ...extraParts] = authorizationHeader?.trim().split(/\s+/) ?? [];

  if (scheme?.toLowerCase() !== 'bearer' || !token || extraParts.length > 0) {
    throw new UnauthorizedException('A valid Bearer token is required');
  }

  try {
    const payload = await jwtService.verifyAsync<AccessTokenPayload>(token);
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new UnauthorizedException('Invalid access token');
    }
    return payload.sub;
  } catch {
    throw new UnauthorizedException('Invalid or expired access token');
  }
}
