import type { DeclarationReflection } from "typedoc";
import { FunctionDocumentation } from "./FunctionDocumentation.tsx";

export function MethodMembers({ methods }: { methods: Array<DeclarationReflection> }) {
	return (
		<div className="space-y-12">
			{methods.map((method) => <FunctionDocumentation
				reflection={method}
				key={method.name}
			/>)}
		</div>
	);
}
