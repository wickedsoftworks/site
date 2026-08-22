type Reading = { vendor: string; renderer: string; version: string };

export type GPU =
	| ({ state: 'ok' } & Reading)
	| { state: 'masked'; version: string }
	| { state: 'unavailable' };

type Context = WebGLRenderingContext | WebGL2RenderingContext;

function context(): Context | null {
	try {
		const canvas = document.createElement('canvas');
		return canvas.getContext('webgl2') ?? canvas.getContext('webgl');
	} catch {
		return null;
	}
}

function text(gl: Context, parameter: number): string {
	const value: unknown = gl.getParameter(parameter);
	return typeof value === 'string' ? value.trim() : '';
}

export function readGpu(): GPU {
	const gl = context();
	if (!gl) return { state: 'unavailable' };

	try {
		const version = text(gl, gl.VERSION) || 'Unknown';
		const debug = gl.getExtension('WEBGL_debug_renderer_info');
		if (!debug) return { state: 'masked', version };

		const vendor = text(gl, debug.UNMASKED_VENDOR_WEBGL) || text(gl, gl.VENDOR);
		const renderer = text(gl, debug.UNMASKED_RENDERER_WEBGL) || text(gl, gl.RENDERER);
		if (!vendor && !renderer) return { state: 'masked', version };

		return {
			state: 'ok',
			vendor: vendor || 'Unknown',
			renderer: renderer || 'Unknown',
			version
		};
	} finally {
		gl.getExtension('WEBGL_lose_context')?.loseContext();
	}
}
