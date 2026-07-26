export function handlePrismaError(error: any) {
  if (error.code === "P2002") {
    return Response.json(
      { error: "هذه القيمة مسجلة بالفعل ويجب أن تكون فريدة" },
      { status: 409 },
    );
  }

  if (error.code === "P2003") {
    return Response.json(
      { error: "أحد العناصر المرتبطة غير موجود" },
      { status: 400 },
    );
  }

  return Response.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
}