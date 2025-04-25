# Sync Engine

See [the sync class](packages/datastore/src/sync/index.ts)

## High-level overview:
- The first time DataStore is started on a new client, a full sync is performed. Subsequent reloads of the app (including browser refresh, or a new browser session) are delta syncs.
- If it has been greater than the `fullSyncInterval` (configurable) since the client has performed a full sync, this operation occurs as a full sync.
- The Sync Engine is well documented in the [DataStore Lifecycle Events doc](./datastore-lifecycle-events.md). The purpose of this doc is to explain anything about the sync process that is not already documented there.


## Types of Syncs
### Full Sync
- All records are fetched from AppSync.

### Delta Sync
- All the records that changed after a given time stamp are fetched.

## How it works

### [Merger](../src/sync/merger.ts)
- A helper class for merging subscription records with the outbox (checks IDs).
- The Sync Engine uses merge in two places:
	- 1. https://github.com/aws-amplify/amplify-js/blob/main/packages/datastore/src/sync/index.ts#L289
		- Triggered by the mutation response. It gets called after the client that authored the change receives the network response of the mutation request they generated.
	- 2. https://github.com/aws-amplify/amplify-js/blob/main/packages/datastore/src/sync/index.ts#L326
		- Triggered by an AppSync real-time subscription event, which is how all clients get notified of the change. In the case of the mutation author, this notification is redundant, but it’s necessary for all other active users of the application. This is why there will always be multiple snapshot returned by `observe` and `observeQuery` in the case of the mutation author.

- The function of [the Merger class](../src/sync/merger.ts) is to filter out any incoming records that have corresponding pending changes in that client’s mutation queue / outbox, and is done to maintain data consistency. We wouldn’t want to write over data that the client has deliberately changed, and essentially undo whatever changes were performed on that client - even temporarily. Thus, each time a change comes in via a mutation response, AppSync subscription, or sync query, **Merger will only persist that change to the local database when there is not a pending mutation for that same record**.
- If there is a pending change in the outbox - we discard the incoming model we were working with inside the merge call (by not saving it). Later, when the record from the Outbox gets processed by AppSync (and conflict resolution rules are applied as appropriate), we will persist the response of the mutation (assuming we don’t change the record again in the interim)
- If there is not a pending change in the outbox - we persist the model to the local store via `Storage.save` within `merge`.
- _Note: We maintain a single instance of a mutation when we are offline (i.e. if we perform multiple updates on the same record, we merge them into a single event). Once we are online, but other mutations are processing, we'll still attempt to merge outgoing events into an existing one if they are not already in flight_
- Merger Example:
	- User A updates record 1
	- The update to record 1 is persisted locally, and enters the mutation queue for persistence to Appsync
	- User B has not yet received the update to record 1, and updates record 1
	- User A receives User B's update to record 1, but has not yet sent the mutation to AppSync
	- If Merger did not first check the mutation queue prior to applying the change from User B, User A would see their update, then user B's update, then, depending on how the conflict is handled by AppSync, could then see their update again. Instead, User A sees their update, and rejects User B's update. Once the conflict is handled by AppSync, any changes that are received are then applied.
- *How to locally test / step through Merger:* 
	- Create a few records and make sure the records go out successfully and are persisted. Then, delete local data in IndexedDB (either by clicking the `clear` button in a sample, or through dev tools), then reload the page, or perform a query.
- **Note: AppSync expects us to send only updated fields in order for merge to work correctly.**

### [Outbox]((../src/sync/outbox.ts))
- A mutation event outbox
- Holds all local changes (even if you close the app). 
- Peek returns the next mutation event to be sent to AppSync, but does not remove it from the outbox.

## [Processors](../src/sync/processors)
- Sync Engine uses processors depending on the type of operation
- All processors utilize observables
- Where retry happens

### Mutation Processor (Local changes)
- Online or offline changes that were optimistically made to the Storage Engine (processed in mutation queue **one by one**).
- Observes Storage Engine for new changes.

### Subscription Processor (Remote changes)
- Real-time subscription messages (such as another client performing a change).
- Uses the Amplify API Graphql package (which then uses PubSub).
### Sync Processor
- When the client goes online, fetch all changes that were performed in AppSync (could be full or delta sync).

## Misc:
- AppSync records are soft-deleted and have a TTL. 
- TODO: special configurations around sync intervals