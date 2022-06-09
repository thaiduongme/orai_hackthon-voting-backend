export function msg400(...msg: string[]) {
  return {
    statusCode: 400,
    message: [...msg],
    error: 'Bad Request',
  };
}
