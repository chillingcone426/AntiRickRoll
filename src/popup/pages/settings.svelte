<script>
    import { onMount } from "svelte";
    import { Card, Button, Input } from "flowbite-svelte";

    let customUrls = [];
    let newUrl = "";

    onMount(() => {
        chrome.storage.local.get("customUrls", (result) => {
            customUrls = result.customUrls ?? [];
        });
    });

    const addUrl = () => {
        const trimmed = newUrl.trim().toLowerCase();
        if (!trimmed || customUrls.map(u => u.toLowerCase()).includes(trimmed)) return;
        customUrls = [...customUrls, trimmed];
        chrome.storage.local.set({ customUrls });
        newUrl = "";
    };

    const removeUrl = (url) => {
        customUrls = customUrls.filter((u) => u !== url);
        chrome.storage.local.set({ customUrls });
    };

    const handleKeydown = (e) => {
        if (e.key === "Enter") addUrl();
    };
</script>

<div class="p-3 space-y-3 select-none">
    <Card padding="none">
        <div class="p-3 space-y-2">
            <p class="text-sm font-semibold text-gray-700">Custom blocked URLs</p>
            <div class="flex gap-2">
                <Input
                    bind:value={newUrl}
                    on:keydown={handleKeydown}
                    placeholder="e.g. youtube.com/watch?v=dQw4w9WgXcQ"
                    size="sm"
                />
                <Button size="sm" on:click={addUrl}>Add</Button>
            </div>
        </div>
    </Card>

    <div class="space-y-2">
        {#each customUrls as url}
            <Card padding="none">
                <div class="flex items-center px-3 py-2 gap-2">
                    <span class="flex-grow text-sm text-gray-700 truncate" title={url}>{url}</span>
                    <Button size="xs" color="red" on:click={() => removeUrl(url)}>Remove</Button>
                </div>
            </Card>
        {/each}
        {#if customUrls.length === 0}
            <p class="text-sm text-gray-500 text-center">No custom URLs added yet.</p>
        {/if}
    </div>
</div>
