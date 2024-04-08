import type { Reflection } from "typedoc";

export const reflectionShouldBeRendered = (reflection: Reflection) =>
	!reflection.comment?.hasModifier("@internal") && !reflection.flags.isExternal
	&& !reflection.flags.isPrivate && !reflection.flags.isProtected;
