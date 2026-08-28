# Author avatars

Square portraits, rendered at 45px on the 8px radius, looked up by author name
in `authorAvatars` in `app/data/kennisbank.ts`.

**That map is empty and this directory holds no files.** It named four
portraits — `stefan`, `thomas-smeman`, `marieke-spijker`, `max` — that were
never drawn, so every article badge requested a file that 404s. `AuthorBadge`
swaps to the author's initial on `@error`, which hid it from visitors but not
from a crawler: Ahrefs read it as four broken images across thirty pages.

So add a name back to `authorAvatars` only together with its file. An unmapped
author keeps the initial tile, which is a cosmetic gap rather than an error.
