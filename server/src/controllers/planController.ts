import { Request, Response, NextFunction } from 'express';
import Plan from '../models/Plan';
import Addon from '../models/Addon';
import logger from '../utils/logger';

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private (Admin)
export const createPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await Plan.create(req.body);

    logger.info(`New plan created: ${plan.name}`);

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  } catch (error) {
    logger.error('Create plan error:', error);
    next(error);
  }
};

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
export const getPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isActive } = req.query;
    const query: any = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const plans = await Plan.find(query).sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: plans,
      count: plans.length,
    });
  } catch (error) {
    logger.error('Get plans error:', error);
    next(error);
  }
};

// @desc    Get plan by ID
// @route   GET /api/plans/:id
// @access  Public
export const getPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    logger.error('Get plan error:', error);
    next(error);
  }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private (Admin)
export const updatePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    logger.info(`Plan updated: ${plan.name}`);

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    logger.error('Update plan error:', error);
    next(error);
  }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private (Admin)
export const deletePlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    logger.info(`Plan deleted: ${plan.name}`);

    res.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    logger.error('Delete plan error:', error);
    next(error);
  }
};
