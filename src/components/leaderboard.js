(function () {

const store = window.CA.services.store

class XLeaderboard extends HTMLElement {
  #unsubscribe = null

  connectedCallback() {
    this.#render()
    this.#unsubscribe = store.subscribe(() => this.#render())
  }

  disconnectedCallback() {
    this.#unsubscribe?.()
  }

  #render() {
    const state = store.get()
    const profile = state.profile || { name: 'Player 1', xp: 0, level: 1 }
    const progress = state.progress || new Map()
    const completed = Array.from(progress.values()).filter(p => p.status === 'completed').length

    this.innerHTML = `
      <section class="page">
        <h1 class="text-2xl mb-2">Leaderboard</h1>
        <p class="subtitle mb-6">Local heroes only. No backend required.</p>

        <div class="card">
          <table class="leaderboard-table font-terminal">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Level</th>
                <th>XP</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="color-quaternary">#1</td>
                <td>${profile.name}</td>
                <td class="color-primary">${profile.level}</td>
                <td class="color-quaternary">${profile.xp}</td>
                <td>${completed}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="color-muted mt-4">Compete with your past self. Export your profile and load it elsewhere.</p>
      </section>
    `
  }
}

customElements.define('x-leaderboard', XLeaderboard)


})()
