import { renderMarkdown } from "@/lib/rendering/renderMarkdown.tsx";
import type { ReactNode } from "react";
import type { Comment } from "typedoc";

export function renderSummary(comment?: Comment | null | undefined): ReactNode {
	return comment?.summary
		? <p className="text-docs-base text-gray-900">{renderMarkdown(comment?.summary)}</p>
		: null;
}
