import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBmi,
  classifyBmi,
  formatBmiClassification,
  validateStudentCreation,
  formatLegacyField,
  validateClassTransfer,
  matchesStudentFilter,
  hasStudentDiscount,
  getStudentActiveDiscounts,
} from '../../src/utils/studentValidation.ts';
import studentReducer, {
  addStudent,
  updateStudent,
  transferStudents,
  addGrowthRecord,
  updateStudentNotes,
  updateTuitionOverride,
  setFilter,
} from '../../src/store/slices/studentSlice.ts';

describe('Student Module Business Rules & Arithmetic (Nhà Trường - Học Sinh)', () => {
  describe('BR-KID-01: BMI Calculation & Pediatric Classification', () => {
    test('calculates correct BMI for standard height and weight', () => {
      // 115cm, 20.5kg -> 20.5 / (1.15 * 1.15) = 15.5009 -> 15.5
      const bmi = calculateBmi(115, 20.5);
      assert.equal(bmi, 15.5);
    });

    test('classifies BMI categories according to pediatric / WHO thresholds', () => {
      assert.equal(classifyBmi(15.5), 'underweight');
      assert.equal(formatBmiClassification('underweight'), 'Thiếu cân');

      assert.equal(classifyBmi(19.2), 'normal');
      assert.equal(formatBmiClassification('normal'), 'Bình thường');

      assert.equal(classifyBmi(26.4), 'overweight');
      assert.equal(formatBmiClassification('overweight'), 'Thừa cân');

      assert.equal(classifyBmi(31.5), 'obese');
      assert.equal(formatBmiClassification('obese'), 'Béo phì');
    });

    test('handles zero or negative inputs defensively', () => {
      assert.equal(calculateBmi(0, 20), 0);
      assert.equal(calculateBmi(120, -5), 0);
      assert.equal(classifyBmi(0), 'normal');
    });
  });

  describe('BR-KID-02: Legacy Record Graceful Degradation (Resolution K008)', () => {
    test('renders placeholder text for empty or undefined fields', () => {
      assert.equal(formatLegacyField('', 'Chưa có mã học sinh'), 'Chưa có mã học sinh');
      assert.equal(formatLegacyField(null, 'Chưa có CCCD'), 'Chưa có CCCD');
      assert.equal(formatLegacyField(undefined, 'Chưa có thông tin'), 'Chưa có thông tin');
    });

    test('preserves valid values when present', () => {
      assert.equal(formatLegacyField('HS-2026-001', 'Chưa có mã học sinh'), 'HS-2026-001');
      assert.equal(formatLegacyField('001202004567', 'Chưa có CCCD'), '001202004567');
    });
  });

  describe('BR-KID-03: Student Creation Validation', () => {
    test('rejects incomplete student payloads with specific field error messages', () => {
      const result = validateStudentCreation({});
      assert.equal(result.isValid, false);
      assert.ok(result.errors.fullName);
      assert.ok(result.errors.dob);
      assert.ok(result.errors.gender);
      assert.ok(result.errors.classId);
      assert.ok(result.errors.studentCode);
      assert.ok(result.errors.cccd);
      assert.ok(result.errors.guardians);
    });

    test('accepts fully formed student payload with primary guardian', () => {
      const result = validateStudentCreation({
        fullName: 'Nguyễn Hoàng Nam',
        dob: '2020-04-12',
        gender: 'nam',
        classId: 'lop-1a1',
        studentCode: 'HS-2026-001',
        cccd: '001202004567',
        guardians: [
          {
            id: 'ph-1',
            fullName: 'Nguyễn Văn Hùng',
            relationship: 'bo',
            phone: '0903123456',
            isEmergencyContact: true,
            isPrimaryPickup: true,
          },
        ],
      });
      assert.equal(result.isValid, true);
      assert.deepEqual(result.errors, {});
    });
  });

  describe('BR-KID-04: Student Transfer & Promotion Validation', () => {
    test('rejects transfer when student list is empty', () => {
      const result = validateClassTransfer({
        studentIds: [],
        sourceClassId: 'lop-1a1',
        targetClassId: 'lop-1a2',
        effectiveDate: '2026-09-16',
        remapFees: true,
        updateChat: true,
        pruneEvaluations: false,
      });
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Vui lòng chọn ít nhất một học sinh để chuyển lớp');
    });

    test('rejects transfer when source class equals target class', () => {
      const result = validateClassTransfer({
        studentIds: ['hs-001'],
        sourceClassId: 'lop-1a1',
        targetClassId: 'lop-1a1',
        effectiveDate: '2026-09-16',
        remapFees: true,
        updateChat: true,
        pruneEvaluations: false,
      });
      assert.equal(result.isValid, false);
      assert.equal(result.error, 'Lớp chuyển đến phải khác lớp hiện tại của học sinh');
    });

    test('accepts valid transfer payload', () => {
      const result = validateClassTransfer({
        studentIds: ['hs-001', 'hs-002'],
        sourceClassId: 'lop-1a1',
        targetClassId: 'lop-2a1',
        effectiveDate: '2026-09-16',
        remapFees: true,
        updateChat: true,
        pruneEvaluations: false,
      });
      assert.equal(result.isValid, true);
    });
  });

  describe('BR-KID-05: Multi-Factor Substring Filtering', () => {
    const mockStudent = {
      id: 'hs-001',
      schoolCode: 'demo',
      studentCode: 'HS-2026-001',
      fullName: 'Nguyễn Hoàng Nam',
      nickName: 'Bơ',
      dob: '2020-04-12',
      gender: 'nam',
      cccd: '001202004567',
      status: 'active',
      classId: 'lop-1a1',
      className: 'Lớp 1A1',
      admissionDate: '2026-09-05',
      guardians: [
        {
          id: 'ph-1',
          fullName: 'Nguyễn Văn Hùng',
          relationship: 'bo',
          phone: '0903123456',
          isEmergencyContact: true,
          isPrimaryPickup: true,
        },
      ],
      growthRecords: [],
    };

    test('matches on full name, nickname, student code, cccd, and guardian phone', () => {
      assert.equal(
        matchesStudentFilter(mockStudent, { search: 'hoàng nam', classId: 'all', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: 'Bơ', classId: 'all', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: 'HS-2026-001', classId: 'all', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '001202004567', classId: 'all', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '0903123456', classId: 'all', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: 'Lê Văn Tự', classId: 'all', status: 'all', gender: 'all' }),
        false
      );
    });

    test('filters accurately by classId and status', () => {
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '', classId: 'lop-1a1', status: 'all', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '', classId: 'lop-2a1', status: 'all', gender: 'all' }),
        false
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '', classId: 'all', status: 'active', gender: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(mockStudent, { search: '', classId: 'all', status: 'chua_xep_lop', gender: 'all' }),
        false
      );
    });

    test('filters accurately by discountFilter (co_mien_giam vs khong_mien_giam)', () => {
      const studentWithDiscount = {
        ...mockStudent,
        tuitionDiscountPercent: 50,
      };
      const studentWithoutDiscount = {
        ...mockStudent,
        tuitionDiscountPercent: undefined,
      };

      const mockPolicy = {
        id: 'disc-01',
        status: 'active',
        targets: [{ targetType: 'class', targetId: 'lop-1a1' }],
      };

      // When filter is 'co_mien_giam'
      assert.equal(
        matchesStudentFilter(studentWithDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'co_mien_giam' }),
        true
      );
      assert.equal(
        matchesStudentFilter(studentWithoutDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'co_mien_giam' }),
        false
      );
      // Student without tuitionDiscountPercent but belonging to class in active policy
      assert.equal(
        matchesStudentFilter(studentWithoutDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'co_mien_giam' }, [mockPolicy]),
        true
      );

      // When filter is 'khong_mien_giam'
      assert.equal(
        matchesStudentFilter(studentWithoutDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'khong_mien_giam' }),
        true
      );
      assert.equal(
        matchesStudentFilter(studentWithDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'khong_mien_giam' }),
        false
      );

      // When filter is 'all'
      assert.equal(
        matchesStudentFilter(studentWithDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'all' }),
        true
      );
      assert.equal(
        matchesStudentFilter(studentWithoutDiscount, { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'all' }),
        true
      );
    });
  });

  describe('BR-KID-06: Redux State Machine Mutations', () => {
    test('transfers students and updates status to active', () => {
      const initialState = {
        students: [
          {
            id: 'hs-001',
            schoolCode: 'demo',
            fullName: 'Nguyễn Hoàng Nam',
            gender: 'nam',
            classId: 'lop-1a1',
            className: 'Lớp 1A1',
            status: 'active',
            admissionDate: '2026-09-05',
            dob: '2020-04-12',
            guardians: [],
            growthRecords: [],
          },
        ],
        selectedStudentId: null,
        filter: { search: '', classId: 'all', status: 'all', gender: 'all' },
        loading: false,
      };

      const nextState = studentReducer(
        initialState,
        transferStudents({
          studentIds: ['hs-001'],
          sourceClassId: 'lop-1a1',
          targetClassId: 'lop-2a1',
          targetClassName: 'Lớp 2A1',
          effectiveDate: '2026-09-16',
          remapFees: true,
          updateChat: true,
          pruneEvaluations: false,
        })
      );

      assert.equal(nextState.students[0].classId, 'lop-2a1');
      assert.equal(nextState.students[0].className, 'Lớp 2A1');
      assert.equal(nextState.students[0].status, 'active');
    });

    test('appends growth record and calculates BMI automatically', () => {
      const initialState = {
        students: [
          {
            id: 'hs-001',
            schoolCode: 'demo',
            fullName: 'Nguyễn Hoàng Nam',
            gender: 'nam',
            classId: 'lop-1a1',
            className: 'Lớp 1A1',
            status: 'active',
            admissionDate: '2026-09-05',
            dob: '2020-04-12',
            guardians: [],
            growthRecords: [],
          },
        ],
        selectedStudentId: null,
        filter: { search: '', classId: 'all', status: 'all', gender: 'all' },
        loading: false,
      };

      const nextState = studentReducer(
        initialState,
        addGrowthRecord({
          studentId: 'hs-001',
          record: {
            measuredAt: '2026-09-15',
            heightCm: 120,
            weightKg: 25,
            measuredBy: 'Y tế học đường',
            notes: 'Phát triển tốt',
          },
        })
      );

      assert.equal(nextState.students[0].growthRecords.length, 1);
      assert.equal(nextState.students[0].growthRecords[0].heightCm, 120);
      assert.equal(nextState.students[0].growthRecords[0].weightKg, 25);
      // 25 / (1.2 * 1.2) = 17.36 -> 17.4
      assert.equal(nextState.students[0].growthRecords[0].bmi, 17.4);
      assert.equal(nextState.students[0].growthRecords[0].bmiClassification, 'underweight');
    });

    test('updates administrative notes and tuition scholarship overrides', () => {
      const initialState = {
        students: [
          {
            id: 'hs-001',
            schoolCode: 'demo',
            fullName: 'Nguyễn Hoàng Nam',
            gender: 'nam',
            classId: 'lop-1a1',
            className: 'Lớp 1A1',
            status: 'active',
            admissionDate: '2026-09-05',
            dob: '2020-04-12',
            guardians: [],
            growthRecords: [],
          },
        ],
        selectedStudentId: null,
        filter: { search: '', classId: 'all', status: 'all', gender: 'all' },
        loading: false,
      };

      const stateWithNotes = studentReducer(
        initialState,
        updateStudentNotes({ studentId: 'hs-001', notes: 'Dị ứng hải sản' })
      );
      assert.equal(stateWithNotes.students[0].notes, 'Dị ứng hải sản');

      const stateWithTuition = studentReducer(
        stateWithNotes,
        updateTuitionOverride({ studentId: 'hs-001', tuitionDiscountPercent: 25 })
      );
      assert.equal(stateWithTuition.students[0].tuitionDiscountPercent, 25);
    });

    test('updates discountFilter in redux state', () => {
      const initialState = {
        students: [],
        selectedStudentId: null,
        filter: { search: '', classId: 'all', status: 'all', gender: 'all', discountFilter: 'all' },
        loading: false,
      };

      const nextState = studentReducer(
        initialState,
        setFilter({ discountFilter: 'co_mien_giam' })
      );
      assert.equal(nextState.filter.discountFilter, 'co_mien_giam');
    });
  });

  describe('BR-KID-07: Tuition Exemption & Discount Identification (hasStudentDiscount & getStudentActiveDiscounts)', () => {
    const student1 = {
      id: 'hs-001',
      fullName: 'Nguyễn Gia Huy',
      classId: 'class-10a1',
      className: 'Lớp 10A1',
      tuitionDiscountPercent: 50,
      guardians: [],
      growthRecords: [],
    };
    const student2 = {
      id: 'hs-006',
      fullName: 'Phạm Nhật Nam',
      classId: 'class-11a2',
      className: 'Lớp 11A2',
      guardians: [],
      growthRecords: [],
    };

    const policies = [
      {
        id: 'disc-001',
        code: 'MG-2026-001',
        name: 'Học bổng tài năng học thuật 50%',
        feeItemName: 'Học phí chính khóa',
        discountType: 'percent',
        discountValue: 50,
        status: 'active',
        validityType: 'academic_year',
        academicYearName: 'Năm học 2026 - 2027',
        reason: 'Đạt giải Nhất HSG Tỉnh',
        targets: [
          { targetType: 'student', targetId: 'hs-001', targetName: 'Nguyễn Gia Huy' },
        ],
      },
      {
        id: 'disc-002',
        code: 'MG-2026-002',
        name: 'Giảm học phí gia đình 2 con (20%)',
        feeItemName: 'Học phí chính khóa',
        discountType: 'percent',
        discountValue: 20,
        status: 'active',
        validityType: 'month_range',
        fromMonth: '2026-09',
        toMonth: '2027-05',
        reason: 'Gia đình nhiều con theo học',
        targets: [
          { targetType: 'class', targetId: 'class-10a1', targetName: 'Lớp 10A1' },
        ],
      },
      {
        id: 'disc-expired',
        code: 'MG-2025-001',
        name: 'Ưu đãi hè 2025',
        feeItemName: 'Học phí chính khóa',
        discountType: 'percent',
        discountValue: 15,
        status: 'expired',
        targets: [
          { targetType: 'student', targetId: 'hs-006', targetName: 'Phạm Nhật Nam' },
        ],
      },
    ];

    test('correctly detects if student has active discount program', () => {
      assert.equal(hasStudentDiscount(student1, policies), true);
      assert.equal(hasStudentDiscount(student2, policies), false);
    });

    test('retrieves single valid discount program per fee item for student prioritizing student scope', () => {
      const { hasDiscount, activeDiscounts } = getStudentActiveDiscounts(student1, policies);
      assert.equal(hasDiscount, true);
      assert.equal(activeDiscounts.length, 1);

      const disc1 = activeDiscounts.find((d) => d.id === 'disc-001');
      assert.ok(disc1);
      assert.equal(disc1.discountDisplay, '50%');
      assert.equal(disc1.scopeType, 'student');
      assert.equal(disc1.scopeText, 'Cá nhân (Nguyễn Gia Huy)');
    });

    test('returns empty array when student has no matching active discounts', () => {
      const { hasDiscount, activeDiscounts } = getStudentActiveDiscounts(student2, policies);
      assert.equal(hasDiscount, false);
      assert.equal(activeDiscounts.length, 0);
    });

    test('correctly handles 3 distinct fee type discount programs for a student', () => {
      const threeFeePolicies = [
        ...policies,
        {
          id: 'disc-004',
          code: 'MG-2026-004',
          name: 'Hỗ trợ xe đưa đón tuyến xa 200.000 đ',
          feeItemName: 'Xe đưa đón',
          discountType: 'fixed_amount',
          discountValue: 200000,
          status: 'active',
          validityType: 'academic_year',
          academicYearName: 'Năm học 2026 - 2027',
          reason: 'Khu vực ngoại thành',
          targets: [
            { targetType: 'student', targetId: 'hs-001', targetName: 'Nguyễn Gia Huy' },
          ],
        },
        {
          id: 'disc-007',
          code: 'MG-2026-007',
          name: 'Hỗ trợ 50% tiền ăn bán trú học sinh đạt giải cấp Tỉnh',
          feeItemName: 'Tiền ăn bán trú',
          discountType: 'percent',
          discountValue: 50,
          status: 'active',
          validityType: 'academic_year',
          academicYearName: 'Năm học 2026 - 2027',
          reason: 'Học sinh đạt giải',
          targets: [
            { targetType: 'student', targetId: 'hs-001', targetName: 'Nguyễn Gia Huy' },
          ],
        },
      ];

      const { hasDiscount, activeDiscounts } = getStudentActiveDiscounts(student1, threeFeePolicies);
      assert.equal(hasDiscount, true);
      assert.equal(activeDiscounts.length, 3); // exactly 1 on tuition, 1 on food, 1 on bus

      const uniqueFeeItems = new Set(activeDiscounts.map((d) => d.feeItemName));
      assert.equal(uniqueFeeItems.size, 3);
      assert.ok(uniqueFeeItems.has('Học phí chính khóa'));
      assert.ok(uniqueFeeItems.has('Tiền ăn bán trú'));
      assert.ok(uniqueFeeItems.has('Xe đưa đón'));

      const busDisc = activeDiscounts.find((d) => d.feeItemName === 'Xe đưa đón');
      assert.ok(busDisc);
      assert.equal(busDisc.discountDisplay, '200.000 đ');

      const foodDisc = activeDiscounts.find((d) => d.feeItemName === 'Tiền ăn bán trú');
      assert.ok(foodDisc);
      assert.equal(foodDisc.discountDisplay, '50%');
    });
  });
});
