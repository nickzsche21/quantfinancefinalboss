# License compliance policy

1. Repository contents are cloned into an ignored directory and are not committed as product source.
2. Ingestion records the exact commit, branch, remote, root license, nested license candidates, path, and transformation type.
3. Repository scripts and notebook cells are never executed during ingestion.
4. Long prose, slides, PDFs, and book text are not republished. The product uses original summaries and prominent source links.
5. Independent mathematical implementations are preferred. Adapted code requires an explicit `adapted-code` label and human review.
6. AGPL-covered code must remain isolated and may not be embedded silently into a closed service.
7. Unknown or conflicting licenses produce a human-review flag and block publication.
8. Takedown requests can be sent through the contact mechanism linked in the product footer.

This file describes engineering controls, not legal advice.
