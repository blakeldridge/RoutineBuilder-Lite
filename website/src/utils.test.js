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
  });

  it('should detect too many pommel types', () => {
    // testPommelTooManyType
  });

  it('should detect too many pommel subtypes', () => {
    // testPommelTooManySubType
  });

  it('should validate rings routine', () => {
    // testRingsValid
  });

  it('should detect too many rings types', () => {
    // testRingsTooManyType
  });

  it('should allow 3 repeated elements on rings when valid', () => {
    // testRings3RepeatedValid
  });

  it('should detect 3 repeated elements on rings when invalid', () => {
    // testRings3RepeatedInvalid
  });

  it('should award bonus on rings', () => {
    // testRingsBonus
  });

  it('should apply penalty on rings', () => {
    // testRingsPenalty
  });

  it('should validate vault routine', () => {
    // testVaultValid
  });

  it('should detect vaults from the same group', () => {
    // testVaultSameGroup
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
