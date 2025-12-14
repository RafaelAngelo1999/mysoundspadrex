import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const fileName = searchParams.get("name");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "URL do arquivo não fornecida" },
        { status: 400 }
      );
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar arquivo: ${response.statusText}`);
    }

    const blob = await response.arrayBuffer();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${
          fileName || "audio.mp3"
        }"`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar arquivo" },
      { status: 500 }
    );
  }
}
