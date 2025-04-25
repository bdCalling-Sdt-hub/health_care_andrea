import { Request, Response } from 'express';
  import { FaqServices } from './faq.service';
  import catchAsync from '../../../shared/catchAsync';
  import sendResponse from '../../../shared/sendResponse';
  import { StatusCodes } from 'http-status-codes';
  
  const createFaq = catchAsync(async (req: Request, res: Response) => {
    const faqData = req.body;
    const result = await FaqServices.createFaq(faqData);
    
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Faq created successfully',
      data: result,
    });
  });
  
  const updateFaq = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const faqData = req.body;
    const result = await FaqServices.updateFaq(id, faqData);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq updated successfully',
      data: result,
    });
  });
  
  const getSingleFaq = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FaqServices.getSingleFaq(id);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq retrieved successfully',
      data: result,
    });
  });
  
  const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
    const result = await FaqServices.getAllFaqs();
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faqs retrieved successfully',
      data: result,
    });
  });
  
  const deleteFaq = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await FaqServices.deleteFaq(id);
    
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Faq deleted successfully',
      data: result,
    });
  });
  
  export const FaqController = {
    createFaq,
    updateFaq,
    getSingleFaq,
    getAllFaqs,
    deleteFaq,
  };