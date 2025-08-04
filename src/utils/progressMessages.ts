/**
 * Progress Messages System
 * 팟캐스트 생성 과정의 단계별 메시지 관리
 */

export interface ProgressStep {
  percentage: number;
  messages: string[];
}

export const PROGRESS_STEPS: Record<string, ProgressStep> = {
  queued: {
    percentage: 0,
    messages: [
      "요청이 접수되었습니다",
      "처리 대기 중입니다",
      "곧 시작됩니다",
      "AI가 준비하고 있어요",
      "잠시만 기다려주세요"
    ]
  },
  processing: {
    percentage: 10,
    messages: [
      "AI가 작업을 시작했어요",
      "내용을 분석하고 있습니다",
      "창의적인 아이디어를 구상 중이에요",
      "흥미로운 스토리를 만들고 있어요",
      "최적의 구성을 찾고 있습니다"
    ]
  },
  script_generated: {
    percentage: 60,
    messages: [
      "멋진 스크립트가 완성되었어요!",
      "이제 목소리를 입혀볼게요",
      "AI가 목소리 톤을 조절하고 있어요",
      "자연스러운 발음을 준비 중이에요",
      "감정을 담은 목소리로 변환할게요"
    ]
  },
  audio_processing: {
    percentage: 85,
    messages: [
      "목소리를 입히는 중이에요",
      "자연스러운 발음을 만들고 있어요",
      "거의 완성되었어요!",
      "마지막 터치를 하고 있습니다",
      "품질을 확인하고 있어요"
    ]
  },
  completed: {
    percentage: 100,
    messages: [
      "팟캐스트가 완성되었어요!",
      "이제 들어보실 수 있습니다",
      "훌륭한 팟캐스트가 탄생했어요",
      "성공적으로 생성되었습니다!",
      "즐겁게 들어보세요"
    ]
  },
  failed: {
    percentage: 0,
    messages: [
      "처리 중 오류가 발생했습니다",
      "다시 시도해주세요",
      "문제가 발생했어요",
      "잠시 후 다시 시도해보세요"
    ]
  }
};

/**
 * 특정 상태에 대한 랜덤 메시지를 반환합니다
 */
export const getRandomMessage = (status: string): string => {
  const step = PROGRESS_STEPS[status];
  if (!step || !step.messages.length) {
    return "처리 중입니다...";
  }
  
  const randomIndex = Math.floor(Math.random() * step.messages.length);
  return step.messages[randomIndex];
};

/**
 * 상태에 따른 기본 진행률을 반환합니다
 */
export const getDefaultProgress = (status: string): number => {
  const step = PROGRESS_STEPS[status];
  return step ? step.percentage : 0;
};

/**
 * 상태별 색상 클래스를 반환합니다
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    case 'processing':
    case 'script_generated':
    case 'audio_processing':
      return 'text-blue-600';
    case 'queued':
    default:
      return 'text-gray-600';
  }
};

/**
 * 진행률 바 색상 클래스를 반환합니다
 */
export const getProgressBarColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'failed':
      return 'bg-red-500';
    case 'processing':
    case 'script_generated':
    case 'audio_processing':
      return 'bg-blue-500';
    case 'queued':
    default:
      return 'bg-gray-400';
  }
};

/**
 * 상태별 한국어 표시명을 반환합니다
 */
export const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'queued':
      return '대기 중';
    case 'processing':
      return '처리 중';
    case 'script_generated':
      return '스크립트 완성';
    case 'audio_processing':
      return '음성 변환 중';
    case 'completed':
      return '완료';
    case 'failed':
      return '실패';
    default:
      return '알 수 없음';
  }
};

/**
 * 예상 완료 시간을 포맷팅합니다
 */
export const formatEstimatedTime = (estimatedCompletion?: string): string | null => {
  if (!estimatedCompletion) return null;
  
  try {
    const completionTime = new Date(estimatedCompletion);
    const now = new Date();
    const diffMinutes = Math.ceil((completionTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return '곧 완료됩니다';
    if (diffMinutes === 1) return '약 1분 후 완료';
    if (diffMinutes < 60) return `약 ${diffMinutes}분 후 완료`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (minutes === 0) return `약 ${hours}시간 후 완료`;
    return `약 ${hours}시간 ${minutes}분 후 완료`;
  } catch {
    return null;
  }
};

/**
 * 진행 상황에 따른 동기부여 메시지를 반환합니다
 */
export const getMotivationalMessage = (progressPercentage: number): string => {
  if (progressPercentage >= 90) {
    return "거의 다 왔어요! 조금만 더 기다려주세요 🎉";
  } else if (progressPercentage >= 70) {
    return "순조롭게 진행되고 있어요 ✨";
  } else if (progressPercentage >= 50) {
    return "절반 이상 완료되었어요 🚀";
  } else if (progressPercentage >= 20) {
    return "AI가 열심히 작업하고 있어요 🤖";
  } else {
    return "곧 시작됩니다 ⏳";
  }
};