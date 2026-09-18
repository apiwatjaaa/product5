import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          background: "#0d9488",
        }}
      >
        <div style={{ width: 22, height: 44, background: "white", borderRadius: 6, marginBottom: 26 }} />
        <div style={{ width: 22, height: 72, background: "white", borderRadius: 6, marginBottom: 26 }} />
        <div style={{ width: 22, height: 106, background: "white", borderRadius: 6, marginBottom: 26 }} />
      </div>
    ),
    { ...size },
  );
}
