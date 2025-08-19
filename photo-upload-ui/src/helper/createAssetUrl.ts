export function createAssetUrl(photoGuid: string): string {
  if (!photoGuid) return "";

  const authState = localStorage.getItem("directus_auth");
  const accessToken = authState ? JSON.parse(authState)["access_token"] : null;

  const url = new URL(`http://localhost:8055/assets/${photoGuid}`);
  if (accessToken) {
    url.searchParams.set("access_token", accessToken);
  }

  return url.toString();
}
