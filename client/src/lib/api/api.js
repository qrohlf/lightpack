export const api = {
  packs: {
    show: (token, packId) =>
      fetch(`/api/packs/${packId}`).then((r) => r.json()),
  },
}
