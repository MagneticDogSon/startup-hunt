export async function register() {
  const { assertProductionSecurityConfig } = await import(
    '@/shared/lib/production-config'
  );
  assertProductionSecurityConfig();
}
