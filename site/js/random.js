function goRandom(manifestUrl) {
  fetch(manifestUrl)
    .then((r) => r.json())
    .then((items) => {
      if (items.length === 0) return;
      const item = items[Math.floor(Math.random() * items.length)];
      window.location.href = item.url;
    });
}
