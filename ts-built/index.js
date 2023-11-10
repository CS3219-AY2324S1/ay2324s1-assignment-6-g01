"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestions = void 0;
const getQuestions = (_, httpResponse) => __awaiter(void 0, void 0, void 0, function* () {
    // get count of all questions
    const countData = yield getLeetcodeQuestions(1);
    const count = countData.data.problemsetQuestionList.total;
    // get all questions
    const questionData = yield getLeetcodeQuestions(count);
    // covert to question object
    const questions = questionData.data.problemsetQuestionList.questions
        // remove paid questions
        .filter((question) => !question.paidOnly)
        // map object
        .map(convertQuestion);
    // return data
    httpResponse.send(questions);
});
exports.getQuestions = getQuestions;
function convertQuestion(leetcodeQuestion) {
    return {
        id: leetcodeQuestion.id,
        title: leetcodeQuestion.title,
        description: leetcodeQuestion.content,
        categories: leetcodeQuestion.topicTags.map((tag) => tag.name),
        complexity: leetcodeQuestion.complexity,
    };
}
function getLeetcodeQuestions(limit) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch("https://leetcode.com/graphql/", {
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
        return yield res.json();
    });
}
