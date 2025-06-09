import { describe, it, expect } from 'vitest';
import scoreRoutine from './assets/utils/calculateDifficulty';
import { Apparatus } from './assets/utils/apparatus';
import { FloorSkills, PommelSkills, PommelTypeSkills, RingsSkills, PbarSkills, HbarSkills } from './assets/utils/skillTypes';

describe('Difficulty Calculation Tests', () => {
  it('should handle too many groups', () => {
    // testTooManyGroups
    const routine = [{"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}];

    const result = scoreRoutine(routine, Apparatus.FLOOR);
    expect(result["difficulty"]).toBe(0.4);
  });

  it('should check element group requirements', () => {
    // testRequirements
  });

  it('should validate floor routine', () => {
    // testFloorValid
    const routine = [{"difficulty":0.5, "group":4, "type":FloorSkills.SINGLE_TWIST}, 
        {"difficulty":0.4, "group":2, "type":FloorSkills.MULTI}, 
        {"difficulty":0.2, "group":3, "type":FloorSkills.SINGLE}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.4, "group":4, "type":FloorSkills.SINGLE_TWIST},
        {"difficulty":0.2, "group":2, "type":FloorSkills.SINGLE}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.3, "group":3, "type":FloorSkills.MULTI}, 
    ];

    const result = scoreRoutine(routine, Apparatus.FLOOR);
    expect(result["score"]).toBe(14.0);
  });

  it('should handle floor connections', () => {
    // testFloorConnections
    const routine = [
        {"difficulty":0.4, "group":4, "type":FloorSkills.SINGLE_TWIST, "connection": true},
        {"difficulty":0.2, "group":2, "type":FloorSkills.SINGLE}, 
        {"difficulty":0.4, "group":4, "type":FloorSkills.SINGLE_TWIST, "connection": true},
        {"difficulty":0.4, "group":2, "type":FloorSkills.MULTI},
    ];

    const result = scoreRoutine(routine, Apparatus.FLOOR);
    expect(result["bonus"]).toBe(0.3);
  });

  it('should check special repetitions on floor', () => {
    // testFloorSpecialRepetitions
    const routine = [
        {"difficulty":0.1, "group":1, "type":FloorSkills.STRENGTH},
        {"difficulty":0.2, "group":1, "type":FloorSkills.STRENGTH},
        {"difficulty":0.1, "group":1, "type":FloorSkills.CIRCLE},
        {"difficulty":0.2, "group":1, "type":FloorSkills.CIRCLE},
    ];

    const result = scoreRoutine(routine, Apparatus.FLOOR);
    expect(result["difficulty"]).toBe(0.4);
  });

  it('should apply floor penalties', () => {
    // testFloorPenalty
    const routine = [{"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}, 
        {"difficulty":0.1, "group":1, "type":FloorSkills.NON_ACRO}];

    const result = scoreRoutine(routine, Apparatus.FLOOR);
    expect(result["penalty"]).toBe(0.3);
  });

  it('should validate pommel routine', () => {
    // testPommelValid
    const routine = [{"difficulty": 0.1, "group":1},
        {"difficulty":0.1, "group": 2},
        {"difficulty":0.4, "group": 2, "type":PommelSkills.FLOP},
        {"difficulty":0.4, "group": 2, "type":PommelSkills.FLOP},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL, "subtype":PommelTypeSkills.TONG_FEI},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.CROSS_TRAVEL},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.CROSS_TRAVEL},
        {"difficulty":0.4, "group": 4, "type":PommelSkills.HANDSTAND_DISMOUNT},
    ];

    const result = scoreRoutine(routine, Apparatus.POMMEL);
    expect(result["score"]).toBe(14.5);
  });

  it('should detect too many pommel types', () => {
    // testPommelTooManyType
    const routine = [
        {"difficulty":0.4, "group": 2, "type":PommelSkills.FLOP},
        {"difficulty":0.4, "group": 2, "type":PommelSkills.FLOP},
        {"difficulty":0.4, "group": 2, "type":PommelSkills.FLOP},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL},
    ];

    const result = scoreRoutine(routine, Apparatus.POMMEL);
    expect(result["difficulty"]).toBe(1.6);
  });

  it('should detect too many pommel subtypes', () => {
    // testPommelTooManySubType
    const routine = [
        {"difficulty":0.5, "group": 2, "type":PommelSkills.FLOP, "subtype":PommelTypeSkills.SOHN_BEZ_FLOP},
        {"difficulty":0.5, "group": 2, "type":PommelSkills.FLOP, "subtype":PommelTypeSkills.SOHN_BEZ_FLOP},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL, "subtype":PommelTypeSkills.TONG_FEI},
        {"difficulty":0.4, "group": 3, "type":PommelSkills.WENDE_TRAVEL, "subtype":PommelTypeSkills.TONG_FEI},

    ];

    const result = scoreRoutine(routine, Apparatus.POMMEL);
    expect(result["difficulty"]).toBe(0.9);
  });

  it('should validate rings routine', () => {
    // testRingsValid
    const routine = [
        {"difficulty":0.2, "group":3},
        {"difficulty":0.1, "group":1},
        {"difficulty":0.3, "group":1, "type":RingsSkills.SWING_HANDSTAND},
        {"difficulty":0.1,"group":1},
        {"difficulty":0.1,"group":2},
        {"difficulty":0.3, "group":4}
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["score"]).toBe(12.5);
  });

  it('should detect too many rings types', () => {
    // testRingsTooManyType
    const routine = [
        {"difficulty":0.3, "group":2, "type":RingsSkills.CROSS},
        {"difficulty":0.3, "group":3, "type":RingsSkills.CROSS},
        {"difficulty":0.3, "group":1, "type":RingsSkills.SWING_HANDSTAND},
        {"difficulty":0.4,"group":3, "type":RingsSkills.MALTESE},
        {"difficulty":0.4, "group":3, "type":RingsSkills.MALTESE}
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["difficulty"]).toBe(1.3);
  });

  it('should allow 3 repeated elements on rings when valid', () => {
    // testRings3RepeatedValid
    const routine = [
        {"difficulty":0.1, "group":2},
        {"difficulty":0.1, "group":3},
        {"difficulty":0.1, "group":2},
        {"difficulty":0.3, "group":1, "type":RingsSkills.SWING_HANDSTAND},
        {"difficulty":0.1,"group":2},
        {"difficulty":0.1,"group":3},
        {"difficulty":0.1, "group":2}
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["difficulty"]).toBe(0.9);
  });

  it('should detect 3 repeated elements on rings when invalid', () => {
    // testRings3RepeatedInvalid
    const routine = [
        {"difficulty":0.1, "group":2},
        {"difficulty":0.1, "group":3},
        {"difficulty":0.1, "group":2},
        {"difficulty":0.1, "group":1},
        {"difficulty":0.1,"group":2},
        {"difficulty":0.1,"group":3},
        {"difficulty":0.1, "group":2}
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["difficulty"]).toBe(0.4);
  });

  it('should award bonus on rings', () => {
    // testRingsBonus
    const routine = [
        {"difficulty":0.2, "group":1, "type":RingsSkills.YAMA_JON},
        {"difficulty":0.3, "group":1, "type":RingsSkills.YAMA_JON, "connection":true},
        {"difficulty":0.3, "group":1, "type":RingsSkills.SWING_HANDSTAND},
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["bonus"]).toBe(0.1);
  });

  it('should apply penalty on rings', () => {
    // testRingsPenalty
        const routine = [
        {"difficulty":0.1, "group":2},
        {"difficulty":0.1, "group":2},
        {"difficulty":0.1, "group":3},
        {"difficulty":0.1, "group":3},
        {"difficulty":0.1, "group":1},
        {"difficulty":0.1, "group":4}
    ];

    const result = scoreRoutine(routine, Apparatus.RINGS);
    expect(result["penalty"]).toBe(0.3);
  });

  it('should validate vault routine', () => {
    // testVaultValid
    const routine = [
        {"difficulty" : 4.8, "group": 4},
        {"difficulty" : 4.4, "group" : 3}
    ];

    const result = scoreRoutine(routine, Apparatus.VAULT);
    console.log(result);
    expect(result["avg_vault"]).toBe(14.6);
  });

  it('should detect vaults from the same group', () => {
    // testVaultSameGroup
        const routine = [
        {"difficulty" : 4.8, "group": 4},
        {"difficulty" : 4.4, "group" : 4}
    ];

    const result = scoreRoutine(routine, Apparatus.VAULT);
    expect(result["vault2"]).toBe(0);
  });

  it('should validate parallel bars routine', () => {
    // testPbarValid
  });

  it('should detect same type used on parallel bars', () => {
    // testPbarSameType
  });

  it('should validate horizontal bar routine', () => {
    // testHbarValid
  });

  it('should detect same type used on horizontal bar', () => {
    // testHbarSameType
  });

  it('should detect valid connection on horizontal bar', () => {
    // testHbarConnection
  });

  it('should handle 5 flight elements on high bar', () => {
    // testHbar5flights
  });
});
