import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IChallenges } from './challenges.interface';
import { Challenges } from './challenges.model';

const createChallenges = async (payload: IChallenges) => {
  const result = await Challenges.create(payload);
  if (!result)
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Challenges',
    );
  return result;
};

const getAllChallenges = async () => {
  const result = await Challenges.find();
  return result;
};

const getSingleChallenges = async (id: string) => {
  const result = await Challenges.findById(id);
  return result;
};

const updateChallenges = async (
  id: string,
  payload: Partial<IChallenges>,
) => {
  const result = await Challenges.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  );
  return result;
};

const deleteChallenges = async (id: string) => {
  const result = await Challenges.findByIdAndDelete(id);
  return result;
};

export const ChallengesServices = {
  createChallenges,
  getAllChallenges,
  getSingleChallenges,
  updateChallenges,
  deleteChallenges,
};
