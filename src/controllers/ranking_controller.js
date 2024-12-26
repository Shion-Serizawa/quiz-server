import { kv } from "/db/kv.js";
import KeyFactory from "/db/key_factory.js";

export default class RankingController {
  static async get({ response }) {
    // 集計
    const entries = kv.list({
      prefix: KeyFactory.answerPrefix(),
    });

    const answers = (await Array.fromAsync(entries)).map((entry) =>
      entry.value
    );

    console.log("answers");
    console.log(answers.filter(answer => !answer.answerDuration));

    const stats = answers.reduce((stats, answer) => {
      const { username, isCorrect, answerDuration } = answer;

      if (!username) {
        return stats;
      }

      if (!stats[username]) {
        stats[username] = { score: 0, time: 0 };
      }

      stats[username].score += isCorrect ?? 0;
      stats[username].time += answerDuration ?? 0;

      return stats;
    }, {});

    console.log("stats");
    console.log(stats);

    const unsorted = Object.keys(stats).map((username) => ({
      username,
      ...stats[username],
    }));

    const sorted = unsorted.toSorted((a, b) => {
      if (a.score === b.score) {
        return a.time - b.time;
      }
      return b.score - a.score;
    });

    const ranking = sorted.map((value, index) => ({
      rank: index + 1,
      ...value,
    }));

    response.body = { ranking };
  }
}
