import type { RoomSnapshot } from '@guess-table/shared';
import { AsyncStatus } from '../../shared/types';

export interface RoomState {
  snapshot: RoomSnapshot | null;
  joinStatus: AsyncStatus;
  joinError: string | null;
  isSubmitting: boolean;
  actionError: string | null;
  guessMode: boolean;
  /** Manually toggled by the player — their own hypothesis, freely reversible. */
  excludedCardIds: string[];
  /** Confirmed wrong by a failed final guess — permanent, not reversible or re-guessable. */
  ruledOutCardIds: string[];
}
