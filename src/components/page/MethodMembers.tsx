import { FunctionSignature } from "@/components/page/FunctionSignature.tsx";
import type { DeclarationReflection } from "typedoc";

export function MethodMembers({ methods }: { methods: Array<DeclarationReflection> }) {
	return (
		<div className="space-y-6">
			{methods.map((method) => {
				if (method.flags.isExternal) return null;
				return <FunctionSignature reflection={method} key={method.name} />;
			})}
		</div>
	);
}
