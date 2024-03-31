import { FunctionDocumentation } from "@/components/page/FunctionDocumentation.tsx";
import type { DeclarationReflection } from "typedoc";

export function MethodMembers({ methods }: { methods: Array<DeclarationReflection> }) {
	return (
		<div className="space-y-12">
			{methods.map((method) => {
				if (method.flags.isExternal) return null;
				return <FunctionDocumentation reflection={method} key={method.name} />;
			})}
		</div>
	);
}
