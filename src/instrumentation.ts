export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }

  const { assertProductionSecurityConfig } = await import(
    '@/shared/lib/production-config'
  );
  assertProductionSecurityConfig();
}
