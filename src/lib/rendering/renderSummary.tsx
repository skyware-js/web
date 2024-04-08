import type { ReactNode } from "react";
import type { Comment } from "typedoc";
import { renderMarkdown } from "./renderMarkdown.tsx";

export function renderSummary(comment?: Comment | null | undefined): ReactNode {
	return comment?.summary
		? <p className="text-docs-base text-gray-900">{renderMarkdown(comment?.summary)}</p>
		: null;
}
