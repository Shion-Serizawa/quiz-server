import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";

export default class RankingController {
  static async get({ response }) {
    // 集計
    const scores = new Map();

    for await (
      const { value: answer } of kv.list({ prefix: KeyFactory.answerPrefix() })
    ) {
      const { username, isCorrect } = answer;
      const score = scores.get(username) ?? 0;
      scores.set(username, score + isCorrect);
    }

    const unsorted = [...scores.keys()].map((username) => ({
      username,
      score: scores.get(username),
    }));

    const sorted = unsorted.toSorted((a, b) => b.score - a.score);

    // ranking
    const ranking = [];
    let currentScore;
    let currentRank = 0;
    let currentOrder = 0;

    for (const { username, score } of sorted) {
      currentOrder += 1;
      if (score !== currentScore) {
        currentRank = currentOrder;
        currentScore = score;
      }

      ranking.push({ rank: currentRank, username, score });
    }

    response.body = { ranking };
  }
}
