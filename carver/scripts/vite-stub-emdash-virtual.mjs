/**
 * Cloudflare static builds omit the EmDash integration; `emdash/runtime` still pulls
 * `virtual:emdash/config`. Stub those virtual modules so Rollup can finish the build.
 */
export function viteStubEmdashVirtual() {
	return {
		name: "stub-emdash-virtual",
		resolveId(id) {
			if (id.startsWith("virtual:emdash/")) {
				return "\0stub:" + id;
			}
		},
		load(id) {
			if (id.startsWith("\0stub:virtual:emdash/")) {
				return "export default {};";
			}
		},
	};
}
