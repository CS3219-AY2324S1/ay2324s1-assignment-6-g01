import { HttpFunction } from "@google-cloud/functions-framework";
import { Question } from "./types/types";

export const getQuestions: HttpFunction = async (_, httpResponse) => {
  // get count of all questions
  const countData: any = await getLeetcodeQuestions(1);
  const count: number = countData.data.problemsetQuestionList.total;

  // get all questions
  const questionData: any = await getLeetcodeQuestions(count);

  // covert to question object
  const questions: Question[] =
    questionData.data.problemsetQuestionList.questions
      // remove paid questions
      .filter((question) => !question.paidOnly)
      // map object
      .map(convertQuestion);

  // return data
  httpResponse.send(questions);
};

function convertQuestion(leetcodeQuestion: any) {
  return {
    id: leetcodeQuestion.id,
    title: leetcodeQuestion.title,
    description: leetcodeQuestion.content,
    categories: leetcodeQuestion.topicTags.map((tag) => tag.name),
    complexity: leetcodeQuestion.complexity,
  } as Question;
}

async function getLeetcodeQuestions(limit: number) {
  let res = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // GraphQL body
    body: JSON.stringify({
      query: `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            complexity: difficulty
            id: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            title
            titleSlug
            content
            topicTags {
              name
            }
          }
        }
      }
      `,
      // GraphQL variables
      variables: { categorySlug: "", skip: 0, limit: limit, filters: {} },
    }),
  });

  return await res.json();
}
