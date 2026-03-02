import { logicalReasoningQuestions as existingLogicalReasoningQuestions } from "./logicalReasoningData";
import { decisionMakingQuestions } from "./aptitudeData/decisionMakingData";
import { causeEffectQuestions } from "./aptitudeData/causeEffectData";
import { statementAssumptionQuestions } from "./aptitudeData/statementAssumptionData";
import { logicalDeductionsQuestions } from "./aptitudeData/logicalDeductionsData";
import { clocksCalendarsQuestions } from "./aptitudeData/clocksCalendarsData";
import { averagesMixturesQuestions } from "./aptitudeData/averagesMixturesData";
import { permutationCombinationQuestions } from "./aptitudeData/permutationCombinationData";
import { simpleCompoundInterestQuestions } from "./aptitudeData/simpleCompoundInterestData";
import { profitLossDiscountQuestions } from "./aptitudeData/profitLossDiscountData";
import { timeWorkWagesQuestions } from "./aptitudeData/timeWorkWagesData";
import { timeSpeedDistanceQuestions } from "./aptitudeData/timeSpeedDistanceData";
import { letterSeriesQuestions } from "./aptitudeData/letterSeriesData";
import { numberSeriesQuestions } from "./aptitudeData/numberSeriesData";
import { puzzlesQuestions } from "./aptitudeData/puzzlesData";
import { seatingArrangementQuestions } from "./aptitudeData/seatingArrangementData";
import { syllogismQuestions } from "./aptitudeData/syllogismData";
import { codingDecodingQuestions } from "./aptitudeData/codingDecodingData";
import { directionSenseQuestions } from "./aptitudeData/directionSenseData";
import { bloodRelationsQuestions } from "./aptitudeData/bloodRelationsData";
import { nonVerbalReasoningQuestions } from "./aptitudeData/nonVerbalReasoningData";
import { verbalReasoningQuestions } from "./aptitudeData/verbalReasoningData";
import { dataSufficiencyQuestions } from "./aptitudeData/dataSufficiencyData";
import { dataInterpretationQuestions } from "./aptitudeData/dataInterpretationData";
import { geometryMensurationQuestions } from "./aptitudeData/geometryMensurationData";
import { algebraEquationsQuestions } from "./aptitudeData/algebraEquationsData";
import { arithmeticAbilityQuestions } from "./aptitudeData/arithmeticAbilityData";
import { quantitativeAptitudeQuestions } from "./aptitudeData/quantitativeAptitudeData";
import { analyticalReasoningQuestions } from "./aptitudeData/analyticalReasoningData";
import { logicalReasoningQuestions as newLogicalReasoningQuestions } from "./aptitudeData/logicalReasoningData";
import { ratioProportionQuestions } from "./aptitudeData/ratioProportionData";

export interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export const aptitudeTopics = [
    { id: "logical_reasoning", name: "Logical Reasoning (General)", icon: "🧠" },
    { id: "analytical_reasoning", name: "Analytical Reasoning", icon: "🔍" },
    { id: "quantitative_aptitude", name: "Quantitative Aptitude", icon: "📊" },
    { id: "arithmetic_ability", name: "Arithmetic Ability", icon: "➕" },
    { id: "algebra_equations", name: "Algebra & Equations", icon: "📐" },
    { id: "geometry_mensuration", name: "Geometry & Mensuration", icon: "🔷" },
    { id: "data_interpretation", name: "Data Interpretation", icon: "📈" },
    { id: "data_sufficiency", name: "Data Sufficiency", icon: "📉" },
    { id: "verbal_reasoning", name: "Verbal Reasoning", icon: "🗣️" },
    { id: "non_verbal_reasoning", name: "Non-Verbal Reasoning", icon: "🧩" },
    { id: "blood_relations", name: "Blood Relations", icon: "👨‍👩‍👧‍👦" },
    { id: "direction_sense", name: "Direction Sense Test", icon: "🧭" },
    { id: "coding_decoding", name: "Coding–Decoding", icon: "💻" },
    { id: "syllogism", name: "Syllogism", icon: "🤔" },
    { id: "seating_arrangement", name: "Seating Arrangement", icon: "🪑" },
    { id: "puzzles", name: "Puzzles", icon: "🧩" },
    { id: "number_series", name: "Number Series", icon: "🔢" },
    { id: "letter_series", name: "Letter Series", icon: "🔠" },
    { id: "time_speed_distance", name: "Time, Speed, Distance", icon: "🚗" },
    { id: "time_work_wages", name: "Time, Work & Wages", icon: "⏳" },
    { id: "profit_loss_discount", name: "Profit, Loss & Discount", icon: "💰" },
    { id: "simple_compound_interest", name: "Simple & Compound Interest", icon: "💳" },
    { id: "permutation_combination", name: "Permutation, Combination & Probability", icon: "🎲" },
    { id: "ratio_proportion", name: "Ratio, Proportion & Partnership", icon: "⚖️" },
    { id: "averages_mixtures", name: "Averages & Mixtures", icon: "🥣" },
    { id: "clocks_calendars", name: "Clocks & Calendars", icon: "📅" },
    { id: "logical_deductions", name: "Logical Deductions", icon: "🧐" },
    { id: "statement_assumption", name: "Statement–Assumption / Conclusion", icon: "📝" },
    { id: "cause_effect", name: "Cause & Effect Reasoning", icon: "⚡" },
    { id: "decision_making", name: "Decision Making", icon: "🎯" }
];

// Merge existing logical reasoning questions with new ones
const logicalReasoningQuestions = [...existingLogicalReasoningQuestions, ...newLogicalReasoningQuestions];

export const aptitudeQuestions: Record<string, Question[]> = {
    "logical_reasoning": logicalReasoningQuestions,
    "analytical_reasoning": analyticalReasoningQuestions,
    "quantitative_aptitude": quantitativeAptitudeQuestions,
    "arithmetic_ability": arithmeticAbilityQuestions,
    "algebra_equations": algebraEquationsQuestions,
    "geometry_mensuration": geometryMensurationQuestions,
    "data_interpretation": dataInterpretationQuestions,
    "data_sufficiency": dataSufficiencyQuestions,
    "verbal_reasoning": verbalReasoningQuestions,
    "non_verbal_reasoning": nonVerbalReasoningQuestions,
    "blood_relations": bloodRelationsQuestions,
    "direction_sense": directionSenseQuestions,
    "coding_decoding": codingDecodingQuestions,
    "syllogism": syllogismQuestions,
    "seating_arrangement": seatingArrangementQuestions,
    "puzzles": puzzlesQuestions,
    "number_series": numberSeriesQuestions,
    "letter_series": letterSeriesQuestions,
    "time_speed_distance": timeSpeedDistanceQuestions,
    "time_work_wages": timeWorkWagesQuestions,
    "profit_loss_discount": profitLossDiscountQuestions,
    "simple_compound_interest": simpleCompoundInterestQuestions,
    "permutation_combination": permutationCombinationQuestions,
    "ratio_proportion": ratioProportionQuestions,
    "averages_mixtures": averagesMixturesQuestions,
    "clocks_calendars": clocksCalendarsQuestions,
    "logical_deductions": logicalDeductionsQuestions,
    "statement_assumption": statementAssumptionQuestions,
    "cause_effect": causeEffectQuestions,
    "decision_making": decisionMakingQuestions,
};

// Helper function to get questions
export const getQuestionsForTopic = (topicId: string, count: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Question[] => {
    const allQuestions = aptitudeQuestions[topicId] || [];

    // Filter by difficulty if specified, or fallback to all if not enough questions
    // Include questions with matching difficulty OR questions with NO difficulty if looking for 'medium' (backward compatibility)
    let filtered = allQuestions.filter(q => q.difficulty === difficulty || (!q.difficulty && difficulty === 'medium'));

    // Fallback: If no questions match the difficulty, fallback to ALL questions
    if (filtered.length === 0 && allQuestions.length > 0) {
        filtered = allQuestions;
    }

    // Shuffle array
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
